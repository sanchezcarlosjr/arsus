package application

import "DialogFlowFulfilment/infraestructure"

type Answer struct {
	Response string
	ancestor game
}

func (receiver *Answer) Reply() {
	infraestructure.StreamRepository().InteractAsAnswer(receiver.Response)
}
