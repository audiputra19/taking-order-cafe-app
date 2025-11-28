export const getCategoryName = (id: number) => {
    let name = "";
    if(id === 1) {
        name = "Makanan";
    } else if(id === 2) {
        name = "Minuman";
    } else if(id === 3) {
        name = "Snack";   
    } else if(id === 4) {
        name = "Kopi"; 
    }

    return name;
}