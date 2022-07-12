import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';


class Footer extends Component {
  constructor(props) {
    super(props)
    const date = new Date()
  }
  render() {
    return (
      <div className="wd_scroll_wrap">
        <footer className="foo-bot">
          <div className="footer-bottom">
            <Container>
              <Row>
                <Col lg={12} md={12} sm={12} className="col-xs-12">
                  <div className="copyright" style={{ textAlign: "center"}}>
                    <p>© 2022 - 2023 <Link to="#"><span>Roast Turkey</span></Link> | All rights reserved.</p>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </footer>
      </div>
    );
  }
}

export default Footer;