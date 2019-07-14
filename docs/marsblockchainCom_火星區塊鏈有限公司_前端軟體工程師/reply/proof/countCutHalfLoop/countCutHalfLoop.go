package main

import (
	"flag"
	"fmt"
	"strconv"
	"strings"
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

	if theValue < 0 {
		fmt.Println("負值無法計算。")
		return
	}

	maxUniqueCutHalfLength := GetMaxUniqueCutHalfLength(theValue)

	if len(argv) > 1 && argv[1] != "" {
		theQuantity, _ = strconv.Atoi(argv[1])
	} else {
		theQuantity = maxUniqueCutHalfLength
	}

	switch theValue {
	case 0:
		fmt.Println("共計被裁切個數為：     0")
	case 1, 2:
		fmt.Printf(" %d = %d\n", theValue, theValue)
		fmt.Printf("%#v\n", []int{theValue})
		fmt.Printf("共計被裁切個數為：     %d\n", theValue)
	default:
		listIdx := 0
		list := make([]int, 0, theQuantity)
		var tmpNewVal, tmpAnotherAnsVal int
		tmpPlaceholderSpace := strconv.Itoa(placeholderSpace)
		tmpPrintFomat := " %" + tmpPlaceholderSpace + "d = %" + tmpPlaceholderSpace + "d + %" + tmpPlaceholderSpace + "d\n"

		for val, leng := theValue, theQuantity-1; listIdx < leng; listIdx++ {
			if val < 3 {
				fmt.Println("(use break from for loop.)")
				break
			}

			tmpNewVal = val >> 1

			if val%2 == 0 {
				tmpAnotherAnsVal = tmpNewVal + 1
				tmpNewVal = tmpNewVal - 1
			} else {
				tmpAnotherAnsVal = tmpNewVal + 1
			}

			fmt.Printf(tmpPrintFomat, val, tmpNewVal, tmpAnotherAnsVal)
			list = append(list, tmpAnotherAnsVal)
			val = tmpNewVal
		}

		list = append(list, tmpNewVal)
		fmt.Printf("%#v\n", list)
		fmt.Printf("共計被裁切個數為：     %d\n", listIdx+1)
	}

	fmt.Printf("預計最大可被裁切個數： %d\n", GetMaxUniqueCutHalfLength(theValue))
}

const (
	BitOfPlatform = 32 << (^uint(0) >> 63)
	NumberMaxInt  = 1<<(BitOfPlatform-1) - 1
)

// 返回最大對半切唯一值數組長度。
func GetMaxUniqueCutHalfLength(value int) int {
	if value < 1 {
		return 0
	} else if value < 3 {
		return 1
	} else {
		var bitLength int
		valueBits := strconv.FormatInt(int64(value), 2)
		bitLength = len(valueBits)
		all1Bits := strings.Repeat("1", bitLength)
		if valueBits != all1Bits {
			bitLength--
		}
		return 2 + (bitLength - 2)
	}
}
