package main

import (
	"DialogFlowFulfilment/application"
	"DialogFlowFulfilment/infraestructure"
	"DialogFlowFulfilment/shared"
	"fmt"
	"time"
)

func main() {
	userResponse := "0"
	for infraestructure.Translation.Yes[userResponse] || userResponse == "0" {
		fmt.Println("===========================================================================================================")
		fmt.Println("\t " + infraestructure.Translation.Title)
		fmt.Println("===========================================================================================================")
		gameManger := application.GameManger{}
		fmt.Println(infraestructure.Translation.Instruction)
		gameManger.Start()
		fmt.Println(infraestructure.Translation.PositiveFeedback)
		time.Sleep(2 * time.Second)
		fmt.Println("\n" + infraestructure.Translation.TryAgain)
		_, _ = fmt.Scan(&userResponse)
		shared.CallClear()
	}
}
