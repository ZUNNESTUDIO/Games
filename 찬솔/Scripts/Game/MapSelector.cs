using UnityEngine;
using UnityEngine.SceneManagement;

public class MapSelector : MonoBehaviour
{
    public void SelectMap(string mapName)
    {
        SceneManager.LoadScene(mapName);
    }
}
