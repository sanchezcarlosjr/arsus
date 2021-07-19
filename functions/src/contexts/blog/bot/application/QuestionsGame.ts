import { DialogflowIntentListing } from '../infraestructure/DialogflowIntentListing';
import * as functions from 'firebase-functions';

interface Node {
  name: string;
  attributes: any;
  parentFollowupIntentName: string;
  children: Node[];
  id: string;
}

export class QuestionsGame {
  private readonly rootFollowupIntentName = functions.config().bot.questions_game;
  private game: Node[];
  private rootIndex = 0;

  constructor(private dialogflowIntent: DialogflowIntentListing) {}

  async load() {
    const intents = await this.dialogflowIntent.list();
    this.game = intents
      .filter((x) => x.rootFollowupIntentName === this.rootFollowupIntentName || x.name === this.rootFollowupIntentName)
      .map((intent, index: number) => {
        if (intent.name === this.rootFollowupIntentName) {
          this.rootIndex = index;
        }
        const messages = intent.messages
          .map((message) => message.text.text)
          .slice(0, 3)
          .join(', ');
        const trainingPhrases = intent.trainingPhrases
          .map((message) => message.parts[0].text)
          .slice(0, 3)
          .join(', ');
        const reply: Node = {
          name: intent.displayName,
          children: [],
          id: intent.name,
          parentFollowupIntentName: intent.parentFollowupIntentName,
          attributes: {
            questions: messages,
            user_expressions: trainingPhrases,
          },
        };
        return reply;
      });
  }

  async adapt(): Promise<Node> {
    await this.load();
    return this.map(this.game.splice(this.rootIndex, 1)[0]);
  }

  private map(tree: Node): Node {
    if (this.game.length === 0) {
      return null;
    }
    const parent = tree.id;
    this.game.forEach((reply, i) => {
      if (reply.parentFollowupIntentName === parent) {
        tree.children.push(reply);
        this.game.splice(i, 1);
      }
    });
    for (const child of tree.children) {
      this.map(child);
    }
    return tree;
  }
}
