using UnityEngine;
using UnityEngine.UI;
using UnityEngine.AI;

public class FPS_ALLINONE_FULL : MonoBehaviour
{
    public static FPS_ALLINONE_FULL Instance;

    void Awake() => Instance = this;

    // ================================================================
    //                          UI
    // ================================================================
    public Text scoreText;
    public GameObject winPanel;
    public GameObject losePanel;

    int playerWins = 0;
    int enemyWins = 0;

    // ================================================================
    //                     캐릭터 커스텀 옵션
    // ================================================================
    [Header("Character Custom")]
    public Material[] hairColors;   // 0=검, 1=흰, 2=갈
    public Material[] skinColors;   // 0=흰,1=갈색,2=어두운갈색,3=살색
    public Texture[] faceTextures;  // 0=웃음 1=화남 2=슬픔

    public GameObject hairObject;
    public Renderer skinRenderer;
    public Renderer faceRenderer;

    // 플레이어 선택값(외부 UI에서 설정되었다고 가정)
    public int selectHair = 0;
    public int selectSkin = 0;
    public int selectFace = 0;

    // ================================================================
    //                       PLAYER SETTINGS
    // ================================================================
    public GameObject playerPrefab;
    public Transform playerSpawnPoint;

    GameObject player;
    CharacterController controller;
    Camera cam;

    float moveSpeed = 7f;
    float slideSpeed = 14f;
    float gravity = -9.8f;
    float jumpForce = 8f;
    bool sliding = false;

    Vector3 velocity;
    float mouseSensitivity = 300f;
    float xRot = 0f;

    int playerHP = 100;
    int playerMaxHP = 100;

    // ================================================================
    //                      GUN SYSTEM (2개)
    // ================================================================
    [Header("Weapon")]
    public Transform gunPoint;

    public int currentGun = 0;  // 0 = Gun1, 1 = Gun2
    public GunData[] guns = new GunData[2];

    [System.Serializable]
    public class GunData
    {
        public int ammo = 30;
        public int maxAmmo = 30;
        public float fireRate = 0.12f;
        public float recoil = 1.5f;
        public float spread = 0.03f;
        public float damage = 20f;
        public float shootDist = 100f;

        public ParticleSystem muzzleFlash;
    }

    float nextFire = 0f;
    float normalFOV = 60f;
    float zoomFOV = 40f;
    float zoomSpeed = 15f;

    // ================================================================
    //                          ENEMY
    // ================================================================
    public GameObject enemyPrefab;
    public Transform enemySpawnPoint;

    GameObject enemy;
    NavMeshAgent enemyAgent;

    int enemyHP = 100;
    int enemyMaxHP = 100;

    float enemyAttackCooldown = 1.2f;
    float nextEnemyShot = 0f;
    float enemyShootDist = 40f;

    // 총알 데미지
    public float enemyGunDamage = 10f;

    // ================================================================
    //                           START
    // ================================================================
    void Start()
    {
        SpawnPlayer();
        SpawnEnemy();
        ApplyCustom();
        UpdateScoreUI();
    }

    // ================================================================
    //                     PLAYER / ENEMY SPAWN
    // ================================================================
    void SpawnPlayer()
    {
        if (player != null) Destroy(player);
        player = Instantiate(playerPrefab, playerSpawnPoint.position, playerSpawnPoint.rotation);
        controller = player.GetComponent<CharacterController>();
        cam = player.GetComponentInChildren<Camera>();
        playerHP = playerMaxHP;
        ApplyCustom();
    }

    void SpawnEnemy()
    {
        if (enemy != null) Destroy(enemy);
        enemy = Instantiate(enemyPrefab, enemySpawnPoint.position, enemySpawnPoint.rotation);
        enemyAgent = enemy.GetComponent<NavMeshAgent>();
        enemyHP = enemyMaxHP;
    }

    // ================================================================
    //                         UPDATE
    // ================================================================
    void Update()
    {
        if (player == null) return;

        PlayerLook();
        PlayerMove();
        PlayerJump();
        PlayerSlide();
        PlayerZoom();
        WeaponInput();

        EnemyAI();
    }

    // ================================================================
    //                      PLAYER LOOK
    // ================================================================
    void PlayerLook()
    {
        float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity * Time.deltaTime;
        float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity * Time.deltaTime;

        xRot -= mouseY;
        xRot = Mathf.Clamp(xRot, -85f, 85f);

        cam.transform.localRotation = Quaternion.Euler(xRot, 0, 0);
        player.transform.Rotate(Vector3.up * mouseX);
    }

    // ================================================================
    //                      PLAYER MOVE
    // ================================================================
    void PlayerMove()
    {
        float x = Input.GetAxis("Horizontal");
        float z = Input.GetAxis("Vertical");

        float speed = sliding ? slideSpeed : moveSpeed;
        Vector3 move = player.transform.right * x + player.transform.forward * z;
        controller.Move(move * speed * Time.deltaTime);

        velocity.y += gravity * Time.deltaTime;
        controller.Move(velocity * Time.deltaTime);
    }

    void PlayerJump()
    {
        if (controller.isGrounded && velocity.y < 0) velocity.y = -2f;
        if (Input.GetKeyDown(KeyCode.Space) && controller.isGrounded) velocity.y = jumpForce;
    }

    void PlayerSlide()
    {
        if (Input.GetKeyDown(KeyCode.J) && controller.isGrounded) sliding = true;
        if (Input.GetKeyUp(KeyCode.J)) sliding = false;
    }

    void PlayerZoom()
    {
        bool zoom = Input.GetMouseButton(2);
        cam.fieldOfView = Mathf.Lerp(cam.fieldOfView, zoom ? zoomFOV : normalFOV, Time.deltaTime * zoomSpeed);
    }

    // ================================================================
    //                      WEAPON INPUT
    // ================================================================
    void WeaponInput()
    {
        if (Input.GetKeyDown(KeyCode.Alpha1)) currentGun = 0;
        if (Input.GetKeyDown(KeyCode.Alpha2)) currentGun = 1;

        if (Input.GetMouseButton(0)) Shoot();
        if (Input.GetMouseButtonDown(1)) Reload();
    }

    void Shoot()
    {
        GunData gun = guns[currentGun];
        if (Time.time < nextFire || gun.ammo <= 0) return;

        nextFire = Time.time + gun.fireRate;
        gun.ammo--;

        if (gun.muzzleFlash) gun.muzzleFlash.Play();

        Vector3 shootDir = cam.transform.forward +
            new Vector3(Random.Range(-gun.spread, gun.spread), Random.Range(-gun.spread, gun.spread), 0);

        if (Physics.Raycast(cam.transform.position, shootDir, out RaycastHit hit, gun.shootDist))
        {
            if (hit.collider.CompareTag("Enemy")) EnemyTakeDamage(gun.damage);
        }

        cam.transform.localRotation *= Quaternion.Euler(-gun.recoil, 0, 0);
    }

    void Reload()
    {
        guns[currentGun].ammo = guns[currentGun].maxAmmo;
    }

    // ================================================================
    //                     PLAYER DAMAGE
    // ================================================================
    public void PlayerTakeDamage(int dmg)
    {
        playerHP -= dmg;
        if (playerHP <= 0) PlayerDead();
    }

    void EnemyTakeDamage(float dmg)
    {
        enemyHP -= (int)dmg;
        if (enemyHP <= 0) EnemyDead();
    }

    // ================================================================
    //                       PLAYER / ENEMY DEAD
    // ================================================================
    void PlayerDead()
    {
        Destroy(player);
        enemyWins++;
        UpdateScoreUI();

        if (enemyWins >= 3)
        {
            losePanel.SetActive(true);
            Time.timeScale = 0;
            return;
        }

        Invoke(nameof(SpawnPlayer), 1.5f);
    }

    void EnemyDead()
    {
        Destroy(enemy);
        playerWins++;
        UpdateScoreUI();

        if (playerWins >= 3)
        {
            winPanel.SetActive(true);
            Time.timeScale = 0;
            return;
        }

        Invoke(nameof(SpawnEnemy), 1.5f);
    }

    // ================================================================
    //                     UPDATE UI
    // ================================================================
    void UpdateScoreUI()
    {
        scoreText.text = $"Player {playerWins} : Enemy {enemyWins}";
    }

    // ================================================================
    //                      APPLY CHARACTER CUSTOM
    // ================================================================
    void ApplyCustom()
    {
        if (hairObject != null) hairObject.GetComponent<Renderer>().material = hairColors[selectHair];
        if (skinRenderer != null) skinRenderer.material = skinColors[selectSkin];
        if (faceRenderer != null) faceRenderer.material.mainTexture = faceTextures[selectFace];
    }

    // ================================================================
    //                         ENEMY AI
    // ================================================================
    void EnemyAI()
    {
        if (enemy == null || player == null) return;

        enemyAgent.SetDestination(player.transform.position);
        float dist = Vector3.Distance(enemy.transform.position, player.transform.position);

        if (dist <= enemyShootDist && Time.time >= nextEnemyShot)
        {
            nextEnemyShot = Time.time + enemyAttackCooldown;
            EnemyShoot();
        }
    }

    void EnemyShoot()
    {
        Vector3 dir = (player.transform.position + Vector3.up * 1.5f) - enemy.transform.position;
        Vector3 enemyEyePos = enemy.transform.position + Vector3.up * 1.5f;
        if (Physics.Raycast(enemyEyePos,
            dir.normalized,
            out RaycastHit hit,
            enemyShootDist))
        {
            if (hit.collider.CompareTag("Player")) PlayerTakeDamage((int)enemyGunDamage);
        }
    }
}
