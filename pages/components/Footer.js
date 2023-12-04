import styles from './FooterStyle.module.css';
import Link from 'next/link';

export default function FooterBar() {
    return (
        <nav className={styles.FooterBar}>
            <div>
                <hr className={styles.line2}></hr>
                <div className={styles.footer}>
                    <h3>Hours</h3>
                    <br></br>
                    <>Open Daily from 7am - 6pm</>
                    <br></br>
                    <>1037 University Dr - Suite 109, College Station, TX 77840</>
                    <br></br>
                    <>(979) 599-3236</>
                </div>
            </div>
        </nav>
    );
}