package application

type GameManger struct {
	SizeChildren int
}

func (receiver *GameManger) Start() {
	tree := factoryResponseType(nil)
	tree.Reply()
}
