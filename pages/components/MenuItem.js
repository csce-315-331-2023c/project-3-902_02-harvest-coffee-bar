import styles from './MenuItemStyle.module.css';

//className={styles.MenuItem}
//className={styles.nameAndPrice}
//className={styles.desc}

export default function GenerateMenuItemPanel({ item }) {
    return (
        <div>
            <div className={styles.MenuItem}>
                <div className={styles.nameAndPrice}>
                    <h1>{item.menu_item_name}</h1>
                    <p>$ {item.price}</p>
                </div>
                <div className={styles.desc}>
                    <p>{item.item_description}</p>
                </div>
            </div>
        </div>
    );
}