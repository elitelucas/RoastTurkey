import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { useWalletModal } from "@pancakeswap-v3/uikit";
import { useWeb3React } from "@web3-react/core";
import useAuth from "hooks/useAuth";
import $ from "jquery";
import { connect } from "react-redux";
import { switchNetwork } from "redux/actions/network";
import { BINANCE_SMART_CHAINID } from "config";

const Header = ({ network, switchNetwork }) => {
  const [scroll, setScroll] = useState(0);
  const [top, setTop] = useState(0);
  const [height, setHeight] = useState(0);
  const { account } = useWeb3React();
  const { login: bscLogin, logout: bscLogout } = useAuth(BINANCE_SMART_CHAINID);
  const { onPresentConnectModal: onBSCPresentConnectModal, onPresentAccountModal: onBSCPresentAccountModal } = useWalletModal(
    bscLogin,
    bscLogout,
    account,
    BINANCE_SMART_CHAINID
  );
  let mount;

  const handleScroll = () => {
    if (mount) setScroll(window.scrollY);
  };

  useEffect(() => {
    mount = true;
    const el = document.querySelector(".gc_main_menu_wrapper");
    setTop(el.offsetTop + 700);
    setHeight(el.offsetHeight);
    window.addEventListener("scroll", handleScroll);
    scroll > top
      ? (document.body.style.paddingTop = `${height}px`)
      : (document.body.style.paddingTop = "0");
    return () => {
      mount = false;
    };
  }, []);

  $(document).ready(() => {
    $('.wd_single_index_menu ul li a[href^="#"]').bind(
      "click",
      function (event) {
        event.preventDefault();
        event.stopPropagation();
        var $anchor = $(this);
        if ($(window).width() > 991) {
          var headerH = "60";
        } else {
          headerH = "56";
        }
        $("html, body")
          .stop()
          .animate(
            {
              scrollTop: $($anchor.attr("href")).offset().top - headerH + "px",
            },
            800
          );
      }
    );
    $(window).scroll(function () {
      var windscroll = $(window).scrollTop();
      var target = $(".wd_single_index_menu ul li");
      if (windscroll >= 0) {
        $(".wd_scroll").each(function (i) {
          if ($(this).position().top <= windscroll + 90) {
            target.removeClass("active");
            target.eq(i).addClass("active");
          }
        });
      } else {
        target.removeClass("active");
        $(".wd_single_index_menu ul li:first").addClass("active");
      }
    });
  });

  return (
    <div id="default" className="wd_scroll_wrap wd_scroll">
      <header className={`gc_main_menu_wrapper ${scroll > top ? "menu_fixed animated fadeInDown" : ""}`}>
        <Container fluid>
          <Row>
            <Col className="col-xs-6" sm={12} md={3} lg={3}>
            </Col>
            <Col lg={9} md={9} sm={12} className="col-xs-6">
              <div className="menu-area">
                <div className="login-btn">
                  {account ? (
                    <React.Fragment>
                      <div className="login_box" onClick={onBSCPresentAccountModal}>
                        <span className="wallet_add">
                          {account.substr(0, 6) +
                            "..." +
                            account.substr(account.length - 4, 4)}
                        </span>
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <button className="btn1" onClick={onBSCPresentConnectModal}>
                        Connect Wallet
                      </button>
                    </React.Fragment>
                  )}
                </div>
              </div></Col>
          </Row>
        </Container>
      </header>
    </div>
  );
};

const mapStateToProps = state => ({
  network: state.network.chainId
});

const mapDispatchToProps = dispatch => ({
  switchNetwork: (chainId) => dispatch(switchNetwork(chainId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
