package infraestructure

import (
	"DialogFlowFulfilment/domain"
	"os"
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
		databaseRepository = NewFileRepository(os.Getenv("QUESTIONS_FILEPATH"))
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
