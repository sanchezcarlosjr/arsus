package domain

import (
	"DialogFlowFulfilment/infraestructure"
	"fmt"
)

type Node struct {
	Value        string
	iteratorSize int
	ancestor     *Node
	Children     []*Node
}

func (receiver *Node) save(child *Node) {
	receiver.Children[receiver.iteratorSize] = child
	receiver.iteratorSize++
}

type GameManger struct {
	fileRepository infraestructure.FileRepository
	length         int
	SizeChildren   int
}

func (receiver *GameManger) Start(fileRepository infraestructure.FileRepository) {
	receiver.fileRepository = fileRepository
	receiver.length = fileRepository.Length()
	tree := receiver.createTree(nil, 0, nil)
	fmt.Println(tree.Children[0])
}

func (receiver *GameManger) createTree(root *Node, level int, ancestor *Node) *Node {
	if level < receiver.length {
		root = &Node{Value: receiver.fileRepository.Row(level), Children: receiver.defaultChildren(), ancestor: ancestor}
		for index := 0; index < receiver.SizeChildren; index++ {
			root.save(receiver.createTree(root.Children[index], 2*level+index+1, root))
		}
	}
	return root
}

func (receiver *GameManger) defaultChildren() []*Node {
	var t []*Node
	for index := 0; index < receiver.SizeChildren; index++ {
		t = append(t, nil)
	}
	return t
}
