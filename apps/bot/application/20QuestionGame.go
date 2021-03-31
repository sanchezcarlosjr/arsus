package application

import "DialogFlowFulfilment/infraestructure"

type GameManger struct {
}

func (receiver *GameManger) Start() {
	infraestructure.DatabaseRepository().First()
	tree := factoryResponseType(nil)
	tree.Reply()
}
