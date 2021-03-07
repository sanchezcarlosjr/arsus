package domain

import (
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

func (receiver *GameManger) createTree(root *Question, level int, ancestor *Question) *Question {
	if level < receiver.length {
		root = &Question{Response: receiver.fileRepository.Row(level), Children: receiver.defaultChildren(), ancestor: ancestor}
		for index := 0; index < receiver.SizeChildren; index++ {
			root.save(receiver.createTree(root.Children[index], 2*level+index+1, root))
		}
	}
	return root
}

func (receiver *GameManger) defaultChildren() []*Question {
	var t []*Question
	for index := 0; index < receiver.SizeChildren; index++ {
		t = append(t, nil)
	}
	return t
}
