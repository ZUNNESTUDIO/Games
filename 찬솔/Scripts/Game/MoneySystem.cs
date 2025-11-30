using UnityEngine;

public class MoneySystem : MonoBehaviour
{
    public static int coins = 0;

    public static void AddWinReward(int chainWins)
    {
        int reward = 5 + Mathf.Max(0, chainWins) * 2;
        coins += reward;
    }

    public static bool Spend(int amount)
    {
        if (amount <= 0 || coins < amount)
        {
            return false;
        }

        coins -= amount;
        return true;
    }
}
