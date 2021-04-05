import { ApiProperty } from "@nestjs/swagger";

export class Pagination {
    @ApiProperty({ description: "페이지당 표시 게시물 수" })
    maxData: number; // 페이지당 표시 게시물 수
    @ApiProperty({ description: "첫번째 페이지 번호" })
    firstPageNumber: number; // 첫번째 페이지 번호
    @ApiProperty({ description: "현재 페이지 번호" })
    currentPageNumber: number; // 현재 페이지 번호
    @ApiProperty({ description: "이전 페이지 번호" })
    prevPageNumber: number;
    @ApiProperty({ description: "다음 페이지 번호" })
    nextPageNumber: number;
    @ApiProperty({ description: "마지막 페이지 번호" })
    finalPageNumber: number; // 마지막 페이지 번호
    @ApiProperty({ description: "게시물 총 수" })
    totalCounts: number; // 전체 수

    constructor(currentPageNumber: number = 1, maxData: number = 10) {
        this.currentPageNumber = currentPageNumber;
        this.maxData = maxData;
    }

    public makePaging(): void {
        // 전체 수가 존재하지 않으면 페이지가 존재하지 않음.
        if (this.totalCounts === 0) {
            return;
        }

        // 현재 페이지가 0이라면 1로
        if (this.currentPageNumber === 0) {
            this.currentPageNumber = 1;
        }

        // 페이지당 보여질 게시물수가 정해지지 않았다면 10으로 default;
        if (this.maxData === 0) {
            this.maxData = 10;
        }

        // 마지막 페이지 계산
        const finalPage: number = Math.ceil(this.totalCounts / this.maxData);

        // 현재 페이지가 마지막 페이지보다 높다면
        if (this.currentPageNumber > finalPage) {
            this.currentPageNumber = finalPage;
        }

        // 현재 페이지가 0보다 작다면
        if (this.currentPageNumber < 0) {
            this.currentPageNumber = 1;
        }

        this.firstPageNumber = 1;

        this.finalPageNumber = finalPage;

        this.prevPageNumber = this.currentPageNumber === 1 ? 1 : this.currentPageNumber - 1;
        this.nextPageNumber = this.currentPageNumber === this.finalPageNumber ? this.currentPageNumber : this.currentPageNumber + 1 > this.firstPageNumber ? this.currentPageNumber + 1 : this.currentPageNumber;
    }
}
