package DialogFlowFulfilment

import (
	"fmt"
	"net/http"
)

func DialogFlowFulfilment(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello, World!")
}
