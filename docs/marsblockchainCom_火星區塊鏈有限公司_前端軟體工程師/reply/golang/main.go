package main

import (
	"./uniqueNtoSumZero"
	"flag"
	"fmt"
	"math/rand"
	"strconv"
	"time"
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

func main() {
	flag.Parse()
	argv := flag.Args()

	var theQuantity int
	if len(argv) > 0 && argv[0] != "" {
		theQuantity, _ = strconv.Atoi(argv[0])
	} else {
		theQuantity = 1 + rand.Intn(uniqueNtoSumZero.GetMaxUniqueCutHalfLength(uniqueNtoSumZero.NumberMaxInt)*2)
		fmt.Printf("使用亂數選號，其值為： %d\n", theQuantity)
	}

	if theQuantity <= 0 {
		panic(fmt.Sprintf("無法計算。 (超出允許範圍 [1,%d] (1 ≤ N ≤ %d)。)", uniqueNtoSumZero.AllowQuantity, uniqueNtoSumZero.AllowQuantity))
	}

	list := uniqueNtoSumZero.Solution(theQuantity)
	fmt.Printf("(Length: %d) %#v\n", len(list), list)
}
