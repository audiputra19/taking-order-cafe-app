export const getRangeLineChart = (periode: number) => {
    let range = "";
    if(periode === 1) {
        range = "last30";
    } else if(periode === 2) {
        range = "quarterly";
    } else if(periode === 3) {
        range = "yearToDate";
    }

    return range;
}