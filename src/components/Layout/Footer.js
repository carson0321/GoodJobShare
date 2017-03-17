import React from 'react';
import { Link } from 'react-router';
import cn from 'classnames';

import Logo from '../images/logo.svg';
import styles from './Footer.module.css';


const Footer = () => (
  <footer className={cn(styles.footer, 'wrapperL')}>
    <Link to="/">
      <Logo className={styles.footer_logo} />
    </Link>
    <div className={styles.footer_container}>
      <div className={styles.copyright}>
        <p>Copyright©GoodJob.life team 2016</p>
        <p>使用者條款與隱私權政策 Emoji provided free by EmojiOne</p>
      </div>
      <div className={styles.emoji}>
        <img src="" alt="" />
        <img src="" alt="" />
      </div>
    </div>
  </footer>
);


export default Footer;
