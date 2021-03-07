package application

import (
	"DialogFlowFulfilment/infraestructure"
	"fmt"
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
	fmt.Println(tree)
}

func (receiver *GameManger) createTree(root *Question, level int, ancestor *Question) *Question {
	if level < receiver.length {
		root = receiver.newNode(level, ancestor)
	}
	return root
}

func (receiver *GameManger) newNode(level int, ancestor *Question) *Question {
	response, responseType := receiver.fileRepository.Row(level)
	fmt.Println(responseType)
	return &Question{Response: response, Children: receiver.defaultChildren(), ancestor: ancestor}
}

func (receiver *GameManger) defaultChildren() []*Question {
	var t []*Question
	for index := 0; index < receiver.SizeChildren; index++ {
		t = append(t, nil)
	}
	return t
}
