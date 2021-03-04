package infraestructure

import (
  "DialogFlowFulfilment/application"
)

func GetStreamRepositoy() application.StreamRepository {
  return &ConsoleRepository{}
}
