import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { getDecimalAmount } from 'utility/formatBalance'
import about from '../../assets/images/about/grill.9817a163.png';
import { useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core'
import { connect } from "react-redux";
import useBuyPreSale from 'hooks/usePresale';
import {fetchBnbBalance, fetchContractBalance, fetchTurkey, fetchReview} from 'utility/tokenBalance'
import NotificationAlert from "react-notification-alert";

const About = () => {
  const network = 56;
  const saleStatus = useSelector(state => state.saleStatus);
  
  const { account } = useWeb3React();
  const [pendingTx, setPendingTx] = useState(false)
  const [rePendingTx, setRePendingTx] = useState(false)
  const [withdrawTx, setWithdrawTx] = useState(false)
  const [, setRequestedBuy] = useState(false)

  const [sendAmount, setSendAmount] = useState(0);
  const [referral, setReferral] = useState('');
  const [contractBalance, setContractBalance] = useState(0);
  const [base, setBase] = useState(0);
  const [turkey, setTurkey] = useState(0);
  const [reward, setReward] = useState(0);
  const notificationAlertRef = React.useRef(null);
  const notify = (message, type) => {
    let options = {};
    options = {
      place: "tc",
      message: message,
      type: type,
      icon: "tim-icons icon-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };
  //
  const handleRefreshStatus = useCallback(async (network, account) => {
    const balance = await fetchContractBalance(network,account);
    if(balance == 0){
      setContractBalance(150);
    }else{
      setContractBalance(parseFloat(150+balance/10**18).toFixed(4));
    }

    const bnb = await fetchBnbBalance(network,account);
    if(bnb == 0){
      setBase(bnb);
    }else{
      setBase(parseFloat(bnb/10**18).toFixed(4));
    }
   
    const eggs = await fetchTurkey(network,account);
    setTurkey(Math.floor(eggs/100000));

    const reward = await fetchReview(network,account);
    if(reward == 0){
      setReward(reward);
    }else{
      setReward(parseFloat(reward/10**18).toFixed(7));
    }
  }, [network, account])

  useEffect(() => {
    if(account !== undefined){
      if(window.location.href.includes('ref')){
        const url = window.location.href.split('ref=')[0];
        setReferral(url+"ref="+account);
      }else{
        setReferral(window.location.href+"?ref="+account);
      }
      handleRefreshStatus(network, account);
    }else if(window.location.href.includes('ref')) {
      const address = window.location.href.split('ref=')[1];
      setReferral(window.location.href);
      handleRefreshStatus(network, address);
    }else{
      setReferral('');
      handleRefreshStatus(network, account);
    }
    //console.log(saleStatus)
  }, [network, account]);

  const { onBuy, onReBuy, onWithdraw } = useBuyPreSale(network);

  const handleBuy = useCallback(async () => {
    try {
      setRequestedBuy(true);
      const tx = await onBuy(getDecimalAmount(sendAmount))
      // user rejected tx or didn't go thru
      if (tx) {
        setRequestedBuy(false)
        handleRefreshStatus(network, account);
        setSendAmount(0)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onBuy, setRequestedBuy, sendAmount])

  const reHandleBuy = useCallback(async () => {
    try {
      setRequestedBuy(true);
      const tx = await onReBuy()
      // user rejected tx or didn't go thru
      if (tx) {
        setRequestedBuy(false)
        handleRefreshStatus(network, account);
        setSendAmount(0)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onBuy, setRequestedBuy])

  const handleWithdraw = useCallback(async () => {
    try {
      setRequestedBuy(true);
      const tx = await onWithdraw()
      // user rejected tx or didn't go thru
      if (tx) {
        setRequestedBuy(false)
        handleRefreshStatus(network, account);
        setSendAmount(0)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onBuy, setRequestedBuy])

  const changeSendAmount = (e) => {
    if (document.activeElement === e.target) {
      var set_amount = e.target.value;
      if (set_amount < 0) set_amount = 0;
      setSendAmount(set_amount);
    }
  }
  const copy = () => {
    if(referral != ''){
      var textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      textarea.value = referral;
      textarea.select();
      document.execCommand('copy', true);
      document.body.removeChild(textarea);
      notify("Copied!", "success");
    }
  }
  const buyAction = async () => {
    // Do some action
    if (account !== undefined) {
      if(sendAmount >= 0.01 ){
        setPendingTx(true)
        await handleBuy()
        setPendingTx(false)
      }else{
        notify("Minimum deposit amount 0.01 BNB", "warning");
      }
    }else{
      notify("Please connect your wallet", "warning");
    }
  }
  const reBuyAction = async () => {
    // Do some action
    if (account !== undefined) {
      setRePendingTx(true)
      await reHandleBuy()
      setRePendingTx(false)
    }else{
      notify("Please connect your wallet", "warning");
    }
  }
  const withdraw = async () => {
    // Do some action
    if (account !== undefined) {
      setWithdrawTx(true)
      await handleWithdraw()
      setWithdrawTx(false)
    }else{
      notify("Please connect your wallet", "warning");
    }
  }

  let page = (
    <div>
      <h2 className="f-40 fw-400 fc-white" className="hidden-xs">
        Nutrition Facts
      </h2>
      <Row>
        <Col lg={5} md={5} sm={12} className="hidden-xs" style={{ textAlign: 'center' }}>
          <img src={about} alt="about_img" style={{ width: "90%" }} />
        </Col>
        <Col lg={1} md={1} sm={12} className="hidden-xs" style={{ textAlign: 'center' }}>
        </Col>
        <Col lg={6} md={6} sm={12} className="col-xs-12 presale-area">
          <div className="buy_token_box">
            <div className="buy_token_subbox">
              <Row>
                <Col lg={6} md={6} sm={6} className="col-xs-6">
                  <p className="f-20 coin_balance">Daily Return</p>
                </Col>
                <Col lg={6} md={6} sm={6} className="col-xs-6" style={{ textAlign: "right" }}>
                  <h3 className="title">10%</h3>
                </Col>
              </Row>
              <Row>
                <Col lg={6} md={6} sm={6} className="col-xs-6">
                  <p className="f-20 coin_balance">APR</p>
                </Col>
                <Col lg={6} md={6} sm={6} className="col-xs-6" style={{ textAlign: "right" }}>
                  <h3 className="title">3650%</h3>
                </Col>
              </Row>
              <Row>
                <Col lg={6} md={6} sm={6} className="col-xs-6">
                  <p className="f-20 coin_balance">Dev Fee</p>
                </Col>
                <Col lg={6} md={6} sm={6} className="col-xs-6" style={{ textAlign: "right" }}>
                  <h3 className="title">3%</h3>
                </Col>
              </Row>
              <Row>
                <Col lg={6} md={6} sm={6} className="col-xs-6">
                  <p className="f-20 coin_balance">Contract</p>
                </Col>
                <Col lg={6} md={6} sm={6} className="col-xs-6" style={{ textAlign: "right" }}>
                  <h3 className="title">{contractBalance} BNB</h3>
                </Col>
              </Row>
              <Row>
                <Col lg={6} md={6} sm={6} className="col-xs-6">
                  <p className="f-20 coin_balance">Wallet</p>
                </Col>
                <Col lg={6} md={6} sm={6} className="col-xs-6" style={{ textAlign: "right" }}>
                  <h3 className="title">{base} BNB</h3>
                </Col>
              </Row>
              <Row>
                <Col lg={6} md={6} sm={6} className="col-xs-6">
                  <p className="f-20 coin_balance">Your Turkey</p>
                </Col>
                <Col lg={6} md={6} sm={6} className="col-xs-6" style={{ textAlign: "right" }}>
                  <h3 className="title">{turkey} Turkey</h3>
                </Col>
              </Row>
              <br/>
              <Row className="buy_token_inputbox">
                <Col lg={12} md={12} sm={12} className="col-xs-12">
                  <input id="send_amount" type="number" step="0.01" onChange={(e) => { changeSendAmount(e) }} value={sendAmount} />
                  <span className="coin_unit">BNB</span>
                </Col>                
              </Row>
            </div>
            <div className="buttons" style={{ textAlign: "center", marginTop: "15px" }}>
              <button className="btn1" style={{ width: "100%", textTransform: 'none' }} onClick={() => { buyAction() }}>{!pendingTx? 'Roast Turkey' : 'Pending Now...'}</button>
            </div>
            <br/>
            <div className="buy_token_subbox" style={{ borderTop: "1px dotted #3964d0"}}>
              <br/>
              <Row>
                <Col lg={6} md={6} sm={6} className="col-xs-6">
                  <p className="f-20 coin_balance">Your Rewards</p>
                </Col>
                <Col lg={6} md={6} sm={6} className="col-xs-6" style={{ textAlign: "right" }}>
                  <h3 className="title">{reward} BNB</h3>
                </Col>
              </Row>
            </div>
            <div className="buttons" style={{ textAlign: "center", marginTop: "5px" }}>
              <Row>
                <Col lg={6} md={6} sm={6} className="col-xs-6">
                  <button className="btn1" style={{ width: "100%", textTransform: 'none' }} onClick={() => { reBuyAction() }}>{!rePendingTx? 'RE-ROAST' : 'Pending Now...'}</button>
                </Col>
                <Col lg={6} md={6} sm={6} className="col-xs-6" style={{ textAlign: "right" }}>
                  <button className="btn1" style={{ width: "100%", textTransform: 'none' }} onClick={() => { withdraw() }}>{!withdrawTx? 'EAT Turkey' : 'Pending Now...'}</button>
                </Col>
              </Row>
            </div>
          </div>
          <div className="buy_token_box">
            <Row>
              <Col lg={12} md={12} sm={12} className="col-xs-12">
                <h3 className="title">Referal Link</h3>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} className="col-xs-12">
                <p className="f-20 coin_balance">Earn 13% of the BNB used to Roast Turkey from anyone who uses your referral link</p>
              </Col>
            </Row>
            <Row>
              <Col lg={8} md={8} sm={8} className="col-xs-8">
                <div className="buy_token_inputbox" style={{ marginTop: "15px", border: "2px solid #3964d0", padding: "10px 17px", textAlign: "center", display: 'block', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                  <span>{referral!=''?referral:'Connect Wallet'}</span>
                </div>
              </Col> 
              <Col lg={4} md={4} sm={4} className="col-xs-4">
                <div className="buttons" style={{ textAlign: "center", marginTop: "15px" }}>
                  <button className="btn1" style={{ width: "100%", textTransform: 'none', height: "50px"}} onClick={() => { copy() }}>COPY</button>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  )

  return (
    <div id='about'>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className="about-area pd-t70 pd-b100">
        <Container>
          {page}
        </Container>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  saleStatus: state.saleStatus,
});

// // const mapDispatchToProps = dispatch => ({
// //   updateSaleStatus: (status) => dispatch(updateSaleStatus(status)),
// // });

export default connect(
  mapStateToProps,
  //mapDispatchToProps
)(About);