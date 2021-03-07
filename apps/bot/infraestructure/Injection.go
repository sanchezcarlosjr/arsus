package infraestructure

import (
	"DialogFlowFulfilment/domain"
)

// TODO: Singleton pattern
func StreamRepository() domain.StreamRepository {
	return &ConsoleRepository{}
}
