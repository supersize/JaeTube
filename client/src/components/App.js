import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import SideBar from "./views/SideBar/SideBar";
import Footer from "./views/Footer/Footer"
import SearchingVideoPage from "./views/SearchingPage/SearchingVideoPage"
import VideoUploadPage from "./views/VideoUploadPage/VideoUploadPage"
import VideoViewPage from "./views/VideoViewPage/VideoViewPage"
import MySubscriptionListPage from "./views/MySubscriptionListPage/MySubscriptionListpage"
import MyRecordListPage from "./views/MyRecordListPage/MyRecordListPage"
import MyVideoListPage from "./views/MyVideoListPage/MyVideoListPage"
import MyInfoPage from "./views/MyInfoPage/MyInfoPage"
import MyCommentListPage from "./views/MyCommentListPage/MyCommentListPage"
import { Layout } from 'antd'

const { Header, Content, Sider } = Layout;

//null   Anyone Can approach
//true   only log-in user can approach
//false  log-in user can't approach

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <Header style={{padding : '0px', background : '#fff'}}  >
          <NavBar />
      </Header>
      <Layout>
        <Sider>
          <SideBar />
        </Sider>
        <Layout>
          <Content className="site-layout-background" style={{background : '#fff'}}>
            <div style={{minHeight: 'calc(100vh - 80px)'}}>
              <Switch>
                <Route exact path="/" component={Auth(LandingPage, null)} />
                <Route exact path="/SearchVideo" component={Auth(SearchingVideoPage, null)} />
                <Route exact path="/login" component={Auth(LoginPage, false)} />
                <Route exact path="/register" component={Auth(RegisterPage, false)} />
                <Route exact path="/mySubscription/list" component={Auth(MySubscriptionListPage, true)} />
                <Route exact path="/record/list" component={Auth(MyRecordListPage, true)} />
                <Route exact path="/myVideo/list" component={Auth(MyVideoListPage, true)} />
                <Route exact path="/comment/list" component={Auth(MyCommentListPage, true)} />
                <Route exact path="/video/upload" component={Auth(VideoUploadPage, true)} />
                <Route exact path="/video/:videoId" component={Auth(VideoViewPage, null)} />
                <Route exact path="/user/changeInfo" component={Auth(MyInfoPage, true)} />
              </Switch>
            </div>
          </Content>
        </Layout>

      </Layout>
      <Footer />
    </Suspense>
  );
}

export default App;
