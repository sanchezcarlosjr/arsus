package domain

type GameManger struct {
	file string
}

func (receiver GameManger) createReplier() game {
	return Answer{}
}
