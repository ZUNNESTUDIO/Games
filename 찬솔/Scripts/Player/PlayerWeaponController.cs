using UnityEngine;

public class PlayerWeaponController : MonoBehaviour
{
    public GameObject primaryWeapon;    // 슬롯 1
    public GameObject secondaryWeapon1; // 슬롯 2
    public GameObject secondaryWeapon2; // 슬롯 3
    public GameObject grenade;          // 슬롯 4

    private GameObject currentWeapon;

    void Start()
    {
        Equip(primaryWeapon);
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Alpha1))
        {
            Equip(primaryWeapon);
        }

        if (Input.GetKeyDown(KeyCode.Alpha2))
        {
            Equip(secondaryWeapon1);
        }

        if (Input.GetKeyDown(KeyCode.Alpha3))
        {
            Equip(secondaryWeapon2);
        }

        if (Input.GetKeyDown(KeyCode.Alpha4))
        {
            Equip(grenade);
        }
    }

    void Equip(GameObject weapon)
    {
        if (weapon == null)
        {
            return;
        }

        if (currentWeapon != null)
        {
            currentWeapon.SetActive(false);
        }

        currentWeapon = weapon;
        currentWeapon.SetActive(true);
    }
}
