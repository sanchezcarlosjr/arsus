package main

import (
  "DialogFlowFulfilment/application"
  "DialogFlowFulfilment/shared"
  "fmt"
  "time"
)

func main() {
	userResponse := "y"
	for userResponse == "y" || userResponse == "yes" || userResponse == "0" {
		fmt.Println("===========================================================================================================")
		fmt.Println("\tSanchezCarlosJr 1.1 My YouTube channel https://www.youtube.com/c/Arsustech/videos")
		fmt.Println("===========================================================================================================")
		gameManger := application.GameManger{}
		fmt.Println("Answer with yes (y), no (n), or previous (p)")
		gameManger.Start()
		fmt.Println("Great, I got it right!")
		time.Sleep(2 * time.Second)
		fmt.Println("\nDo you want to go again? (y/n)")
		_, _ = fmt.Scan(&userResponse)
		shared.CallClear()
	}
}
