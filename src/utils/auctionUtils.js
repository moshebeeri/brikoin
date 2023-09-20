class AuctionUtils {
  compareDutch(a, b) {
    if (a.price === b.price) {
      if (a.time < b.time) {
        return -1;
      }
      if (a.time > b.time) {
        return 1;
      }
      return 0;
    }

    if (a.price < b.price) {
      return -1;
    }

    return 1;
  }

  compareEnglish(a, b) {
    if (a.price === b.price) {
      if (a.time < b.time) {
        return -1;
      }
      if (a.time > b.time) {
        return 1;
      }
      return 0;
    }

    if (a.price > b.price) {
      return -1;
    }

    return 1;
  }

  compareRows(a, b) {
    if (a.auctionId === b.auctionId) {
      if (a.type === "english") {
        return this.compareEnglish(a, b);
      } else {
        return this.compareDutch(a, b);
      }
    }

    if (a.auctionId > b.auctionId) {
      return -1;
    }

    return 1;
  }

  sortBidsByType(rows, auctions) {
    if (rows && rows.length > 0) {
      return rows
        .map(row => {
          const auction = auctions.filter(
            auction => auction.id === row.auctionId
          )[0];
          row.type = auction.type;
          return row;
        })
        .sort(this.compareRows.bind(this));
    }
    return [];
  }

  getBidStatus(sortedRows, bid, auctionAsk) {
    let index;
    let amount = auctionAsk.amount;
    for (index = 0; index < sortedRows.length; index++) {
      if (sortedRows[index].id === bid.id) {
        break;
      }
      amount = amount - parseInt(sortedRows[index].size);
    }
    if (amount <= 0) {
      return "outBid";
    }
    if (parseInt(amount) - parseInt(bid.size) >= 0) {
      return "bidActive";
    }
    return "bidPartly";
  }
}

const auctionUtils = new AuctionUtils();

export default auctionUtils;
