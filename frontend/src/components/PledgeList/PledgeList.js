import React, { Component } from 'react';
import CharitableDonationsAbi from '../../abis/CharitableDonations.json';
import PledgeCard from '../PledgeCard.js/PledgeCard';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract('0x9565c7934fF9a31FD91D7fa861DD8942AdCD296c', CharitableDonationsAbi, provider);

class PledgeList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pledges: []
    };
  }

  async componentDidMount() {
    const pledges = await contract.getPledges();
    this.setState({ pledges });
  }

  parsePledge(pledge) {
    let parsed = {};
    parsed.id = pledge[0].toNumber();
    parsed.creator = pledge[1];
    parsed.createdAt = pledge[2].toNumber();
    parsed.initialAmount = ethers.utils.formatEther(pledge[3]);
    parsed.goalAmount = ethers.utils.formatEther(pledge[4]);
    parsed.raisedAmount = ethers.utils.formatEther(pledge[5]);
    parsed.duration = pledge[6].toNumber();
    parsed.endedAt = pledge[7].toNumber() || null;
    parsed.charityAddress = pledge[8];
    parsed.isVerified = pledge[9];

    parsed.charity = null;
    if (pledge.charity && pledge.isVerified) {
      parsed.charity = {
        addr: pledge.charity[0],
        name: pledge.charity[1],
        description: pledge.charity[2],
        websiteUrl: pledge.charity[3],
        imageUrl: pledge.charity[4]
      };
    }

    console.log(parsed);
    return parsed;
  }

  render() {

    return (
      <div className='container-fluid'>
        <h1>Open Pledges</h1>
        <div>
          {this.state.pledges.map((pledge, index) => {
            let parsed = this.parsePledge(pledge);
            return <PledgeCard key={index} pledge={parsed} />
          })}
        </div>
      </div>
    );
  }
}

export default PledgeList;