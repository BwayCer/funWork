package main

import (
	"flag"
	"fmt"
	"strconv"
)

func main() {
	flag.Parse()
	argv := flag.Args()

	var theValue, theQuantity int
	var placeholderSpace int
	if len(argv) > 0 && argv[0] != "" {
		theValue, _ = strconv.Atoi(argv[0])
		placeholderSpace = len(argv[0])
	} else {
		theValue = NumberMaxInt
		placeholderSpace = len(strconv.Itoa(theValue))
	}
	if len(argv) > 1 && argv[1] != "" {
		theQuantity, _ = strconv.Atoi(argv[1])
	} else {
		// TODO 最大可被裁切數
		theQuantity = NumberMaxInt >> 1
	}

	if theValue < 0 {
		fmt.Println("負值無法計算。")
	}
	switch theValue {
	case 0:
		fmt.Println("共計被裁切數為 0 個。")
	case 1, 2:
		fmt.Printf(" %d = %d\n", theValue, theValue)
		fmt.Println("共計被裁切數為 1 個。")
	default:
		loop := 0
		var tmpNewVal, tmpAnotherVal int
		tmpPlaceholderSpace := strconv.Itoa(placeholderSpace)
		tmpPrintFomat := " %" + tmpPlaceholderSpace + "d = %" + tmpPlaceholderSpace + "d + %" + tmpPlaceholderSpace + "d\n"

		for val, leng := theValue, theQuantity; loop < leng; loop++ {
			tmpNewVal = val >> 1

			if val%2 == 0 {
				tmpAnotherVal = tmpNewVal + 1
				tmpNewVal = tmpNewVal - 1
			} else {
				tmpAnotherVal = tmpNewVal + 1
			}

			fmt.Printf(tmpPrintFomat, val, tmpNewVal, tmpAnotherVal)
			val = tmpNewVal

			if val < 3 {
				// NOTE 因為是手動退出，故需補上本次的運行次數
				loop++
				break
			}
		}

		fmt.Printf("共計被裁切數為 %d 個。\n", loop*2)
	}
}

const (
	BitOfPlatform = 32 << (^uint(0) >> 63)
	NumberMaxInt  = 1<<(BitOfPlatform-1) - 1
)
