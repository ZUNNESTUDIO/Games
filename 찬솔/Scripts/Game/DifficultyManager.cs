using UnityEngine;

public class DifficultyManager : MonoBehaviour
{
    public static float enemyDamage = 10f;
    public static float enemySpawnRate = 1.0f;

    public static void AdjustDifficulty(int winStreak)
    {
        enemyDamage = 10f + Mathf.Max(0, winStreak) * 1.5f;
        enemySpawnRate = Mathf.Max(0.3f, 1.0f - Mathf.Max(0, winStreak) * 0.05f);
    }
}
