package domain
import "DialogFlowFulfilment/infraestructure"

type GameManger struct {
}

func (receiver GameManger) Start(fileRepository infraestructure.FileRepository) {
	head := NewQuestion(fileRepository.Row(2*1))
	yes := NewQuestion(fileRepository.Row(2*2))
	yes.ancestor = &head
  no := NewQuestion(fileRepository.Row(2*3))
  no.ancestor = &head
	head.Add(&yes)
  head.Add(&no)
	head.Reply()
}


func bifurcate(fileRepository infraestructure.FileRepository) {
  head := NewQuestion(fileRepository.Row(2*1))
  yes := NewQuestion(fileRepository.Row(2*2))
  yes.ancestor = &head
  no := NewQuestion(fileRepository.Row(2*3))
  no.ancestor = &head
  head.Add(&yes)
  head.Add(&no)
}
