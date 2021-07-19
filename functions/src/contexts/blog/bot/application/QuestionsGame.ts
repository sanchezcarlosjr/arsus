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
  private rootIndex = 0;

  constructor(private dialogflowIntent: DialogflowIntentListing) {}

  async load() {
    const intents = await this.dialogflowIntent.list();
    return intents
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
            response: messages,
            invoker: trainingPhrases,
          },
        };
        return reply;
      });
  }

  async adapt(): Promise<Node> {
    const game = await this.load();
    const root = game.splice(this.rootIndex, 1)[0];
    return this.map(root, game);
  }

  private map(tree: Node, game: Node[]): Node {
    if (game.length === 0) {
      return null;
    }
    const newGame: Node[] = [];
    const parent = tree.id;
    game.forEach((reply) =>
      reply.parentFollowupIntentName === parent ? tree.children.push(reply) : newGame.push(reply)
    );
    for (const child of tree.children) {
      this.map(child, newGame);
    }
    return tree;
  }
}
