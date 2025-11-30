using System.Collections.Generic;
using UnityEngine;

public class PlayerInventory : MonoBehaviour
{
    private readonly HashSet<string> ownedWeapons = new HashSet<string>();

    public void AddWeapon(Weapon weapon)
    {
        if (weapon == null)
        {
            return;
        }

        ownedWeapons.Add(weapon.weaponName);
    }

    public bool HasWeapon(Weapon weapon)
    {
        return weapon != null && ownedWeapons.Contains(weapon.weaponName);
    }
}
