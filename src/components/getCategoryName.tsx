export const getCategoryName = (id: number) => {
    let name = "";
    if(id === 1) {
        name = "Food";
    } else if(id === 2) {
        name = "Beverages";
    } else if(id === 3) {
        name = "Snack";   
    } else if(id === 4) {
        name = "Coffee"; 
    }

    return name;
}