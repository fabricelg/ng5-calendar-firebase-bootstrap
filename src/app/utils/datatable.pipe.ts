import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    // Retourne tout item de items matchant avec term 
    transform(items: any[], term: string, fields: string[]): any {
        
        if (!term) return items;

        let termTabl = term.split(' ').filter(term => term);
        let allTermInTermTablMatchInOneFieldInItem = (item) => termTabl.findIndex(term => 
            fields.findIndex(field => item[field] && item[field].toString().toLowerCase().indexOf(term.toLowerCase()) !== -1) == -1
        ) == -1;

        return items.filter(item => allTermInTermTablMatchInOneFieldInItem(item));
    }
}

@Pipe({
    name: 'sortBy'
})
export class SortByPipe implements PipeTransform {
    transform(items: any[], sortedBy: string): any {
        //console.log('sortedBy', sortedBy);
        
        //console.log('items', items);
        var t = items.sort((a, b) => {return b[sortedBy] - a[sortedBy]});
        //console.log('items sort', items);
        return t;
    }
}