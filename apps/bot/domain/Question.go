package domain

import "DialogFlowFulfilment/infraestructure"

type Question struct {
	Response     string
	iteratorSize int
	ancestor     *Question
	Children     []*Question
}

func (receiver *Question) save(child *Question) {
	receiver.Children[receiver.iteratorSize] = child
	receiver.iteratorSize++
}

func (receiver *Question) Reply() {
	userResponse := infraestructure.GetStreamRepositoy().Interact(receiver.Response)
	child := *receiver.Children[userResponse]
	child.Reply()
}
