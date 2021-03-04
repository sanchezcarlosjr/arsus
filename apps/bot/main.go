package main

import (
  "DialogFlowFulfilment/domain"
  "DialogFlowFulfilment/infraestructure"
)

func main() {
  fileRepository := infraestructure.FileRepository{}
  fileRepository.Read("./questions.txt")
  gameManger := domain.GameManger{}
  gameManger.Start(fileRepository)
}
