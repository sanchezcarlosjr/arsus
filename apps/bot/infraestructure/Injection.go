package infraestructure

import (
	"DialogFlowFulfilment/domain"
	"sync"
)

var (
	streamRepository   domain.StreamRepository
	databaseRepository domain.DatabaseRepository
	once               sync.Once
)

func init() {
	once.Do(func() {
		streamRepository = &ConsoleRepository{}
		databaseRepository = NewFirestoreRepository("20QuestionsGame")
	})
}

func StreamRepository() domain.StreamRepository {
	return streamRepository
}

func SetStreamRepository(newStreamRepository domain.StreamRepository) {
	streamRepository = newStreamRepository
}

func DatabaseRepository() domain.DatabaseRepository {
	return databaseRepository
}
