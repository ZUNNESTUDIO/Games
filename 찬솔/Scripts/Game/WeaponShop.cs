using UnityEngine;

public class WeaponShop : MonoBehaviour
{
    public Weapon[] primaryWeapons;    // 20개
    public Weapon[] secondaryWeapons;  // 10개
    public Weapon[] bombWeapons;       // 5개

    public bool BuyWeapon(Weapon weapon, PlayerInventory inventory)
    {
        if (weapon == null)
        {
            return false;
        }

        if (inventory != null && inventory.HasWeapon(weapon))
        {
            Debug.Log("이미 보유한 무기입니다.");
            return false;
        }

        if (MoneySystem.Spend(weapon.price))
        {
            inventory?.AddWeapon(weapon);
            return true;
        }

        Debug.Log("돈 부족!");
        return false;
    }
}
