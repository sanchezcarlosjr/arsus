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
		databaseRepository = NewFileRepositoryFromStorage("https://firebasestorage.googleapis.com/v0/b/arsus-production.appspot.com/o/assets%2Fquestions.txt?alt=media", "questions.txt")
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
