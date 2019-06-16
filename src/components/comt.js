export const colorClass = s => {
    switch(s) {
      case 'saved':        return 'is-success';
      case 'notChanged':           return '';
      default:             return 'is-warning';
    }
}
