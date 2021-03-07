package main

import (
	"DialogFlowFulfilment/domain"
	"DialogFlowFulfilment/infraestructure"
)

func main() {
	fileRepository := infraestructure.FileRepository{}
	fileRepository.Read("./questions.txt")
	gameManger := domain.GameManger{
		SizeChildren: 2,
	}
	gameManger.Start(fileRepository)
}
