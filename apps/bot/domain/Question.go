package domain
import "DialogFlowFulfilment/infraestructure"
type Question struct {
	Response string
	ancestor game
	Children []game
}

func NewQuestion(response string, children ...game) Question{
  return Question{
    Response: response,
    Children: children,
  }
}

func (receiver *Question) Reply() {
	userResponse := infraestructure.GetStreamRepositoy().Interact(receiver.Response)
	receiver.Children[userResponse].Reply()
}

func (receiver *Question) Add(child game) {
  receiver.Children = append(receiver.Children, child)
}
