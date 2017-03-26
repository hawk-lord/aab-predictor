/**
 * Created by per on 2017-03-26.
 */


const AabPredictor = (function() {

    const cleanMoneyString = (balanceString) => {
        balanceString = balanceString.replace("+", "");
        balanceString = balanceString.replace("\u00A0", "");
        balanceString = balanceString.replace(" EUR", "");
        balanceString = balanceString.replace(" ", "");
        balanceString = balanceString.replace(",", ".");
        return balanceString;
    };

    const numberFormat = new Intl.NumberFormat(window.navigator.language, { minimumFractionDigits: 2 });
    const string = "Tillgängligt belopp:";
    const ths = document.evaluate('//*[text()="' + string + '"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0; i < ths.snapshotLength; i++ ) {
        const th = ths.snapshotItem(i);
        const td = th.nextSibling.nextSibling;
        const textNode = td.firstChild;
        let balance = Number.parseFloat(cleanMoneyString(textNode.nodeValue));

        const table = th.parentNode.parentNode.parentNode.nextSibling.nextSibling;

        const rows = table.rows;
        for (let row of rows) {
            const cells = row.cells;
            const cellcount = cells.length;
            if (cellcount < 6) {
                continue;
            }
            const amountString = cells[1].firstChild.nodeValue;
            if (!amountString) {
                continue;
            }
            if (amountString === "Belopp") {
                const newCell = row.insertCell();
                newCell.className = "right";
                const newText  = document.createTextNode("Nytt tillgängligt belopp");
                newCell.appendChild(newText);
                continue;
            }
            const cleanAmountString = cleanMoneyString(amountString);
            if (isNaN(cleanAmountString)) {
                continue;
            }
            const amount = Number.parseFloat(cleanAmountString);
            balance = balance + amount;
            const newCell = row.insertCell();
            newCell.className = "right";
            const newText  = document.createTextNode(numberFormat.format(balance));
            newCell.appendChild(newText);
        }
    }

}

)();
