import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import { Input } from 'antd';

class SearchBar extends Component {

  doSearch = async(val) => {
    if (val.length <= 10) { //must be a block height
      const b = await fetch("https://api.helium.io/v1/blocks/" + val)
      if (b.status === 200) {
        const res = await b.json()
        this.props.history.push("/blocks/" + res.data.hash);
        return;
      } else {
        this.props.history.push("/error");
      }
    } else {
      //try a block hash first
      const b = await fetch("https://api.helium.io/v1/blocks/hash/" + val)
      if (b.status === 200) {
        console.log("block hash")
        const res = await b.json()
        this.props.history.push("/blocks/" + res.data.hash);
        return;
      }
      // try a txn hash
      const t = await fetch("https://api.helium.io/v1/transactions/" + val)
      if (t.status === 200) {
        console.log("txn hash")
        const res = await t.json()
        this.props.history.push("/txns/" + res.data.hash);
        return;
      }      
      // try a hotspot
      const h = await fetch("https://api.helium.io/v1/hotspots/" + val)
      if (h.status === 200) {
        console.log("hotspot")
        const res = await h.json()
        this.props.history.push("/hotspots/" + res.data.address);
        return;
      }
      // try an account
      const a = await fetch("https://api.helium.io/v1/accounts/" + val)
      if (a.status === 200) {
        console.log("acct")
        const res = await a.json()
        console.log(res)
        this.props.history.push("/accounts/" + res.data.address);
        return;
      }
    }
  }

  render() {    
    return (
      <div>
          <Input.Search onSearch={this.doSearch} size="large" placeholder="Search for a block height, hash, transaction, or address"></Input.Search>
      </div>
    )
  }
}

export default withRouter(SearchBar);
