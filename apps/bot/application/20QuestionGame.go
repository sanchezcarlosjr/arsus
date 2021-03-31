package application

import "DialogFlowFulfilment/infraestructure"

type GameManger struct {
	SizeChildren int
}

func (receiver *GameManger) Start() {
	infraestructure.DatabaseRepository().First()
	tree := factoryResponseType(nil)
	tree.Reply()
}
