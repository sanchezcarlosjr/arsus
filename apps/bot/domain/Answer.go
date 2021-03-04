package domain

import "DialogFlowFulfilment/infraestructure"

type Answer struct {
	Response string
  ancestor game
}

func (receiver *Answer) Reply() {
	infraestructure.GetStreamRepositoy().InteractAsAnswer(receiver.Response)
}

