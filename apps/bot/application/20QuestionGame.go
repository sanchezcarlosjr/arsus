package application

import (
	"DialogFlowFulfilment/domain"
	"DialogFlowFulfilment/infraestructure"
)

type GameManger struct {
	fileRepository infraestructure.FileRepository
	length         int
	SizeChildren   int
}

func (receiver *GameManger) Start(fileRepository infraestructure.FileRepository) {
	receiver.fileRepository = fileRepository
	receiver.length = fileRepository.Length()
	tree := receiver.createTree(nil, 0, nil)
	tree.Reply()
}

func (receiver *GameManger) createTree(root domain.Game, level int, ancestor domain.Game) domain.Game {
	if level < receiver.length {
		root = receiver.factoryResponseType(level, ancestor)
	}
	return root
}

func (receiver *GameManger) factoryResponseType(level int, ancestor domain.Game) domain.Game {
	response, discriminator := receiver.fileRepository.Row(level)
	switch discriminator {
	case "Q":
		question := &Question{Response: response, ancestor: ancestor, Children: receiver.defaultChildren()}
		for index := 0; index < receiver.SizeChildren; index++ {
			question.save(receiver.createTree(question.Children[index], 2*level+index+1, question))
		}
		return question
	case "A":
		return &Answer{Response: response}
	}
	return nil
}

func (receiver *GameManger) defaultChildren() []domain.Game {
	var t []domain.Game
	for index := 0; index < receiver.SizeChildren; index++ {
		t = append(t, nil)
	}
	return t
}
