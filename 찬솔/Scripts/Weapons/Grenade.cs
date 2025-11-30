using UnityEngine;

public class Grenade : Weapon
{
    public GameObject grenadePrefab;
    public Transform throwPoint;
    public float throwForce = 10f;

    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            Throw();
        }
    }

    void Throw()
    {
        if (grenadePrefab == null || throwPoint == null)
        {
            return;
        }

        GameObject grenadeInstance = Instantiate(grenadePrefab, throwPoint.position, throwPoint.rotation);
        if (grenadeInstance.TryGetComponent<Rigidbody>(out var rigidbody))
        {
            rigidbody.AddForce(throwPoint.forward * throwForce, ForceMode.VelocityChange);
        }
    }
}
