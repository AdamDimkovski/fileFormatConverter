<script lang="ts">
    import dropdownArrow from '$lib/assets/dropdownArrow.png';
    import googleDrive from '$lib/assets/googleDriveIcon.png';
    import oneDrive from '$lib/assets/oneDriveIcon.png';
    import dropboxIcon from '$lib/assets/dropboxIcon.svg';
    import urlIcon from '$lib/assets/urlIcon.png';
    import fileUpload from '$lib/assets/fileUpload.svg';

    interface DropdownItem {
        id: number;
        name: string;
        img: string | null;
    }

    const items: DropdownItem[] = [
    { id: 1, name: 'Upload Options:', img: null},
    { id: 2, name: 'Upload From Device', img: fileUpload},
    { id: 3, name: 'Google Drive', img: googleDrive },
    { id: 4, name: 'One Drive', img: oneDrive },
    { id: 5, name: 'Drop Box', img: dropboxIcon },
    { id: 6, name: 'URL', img: urlIcon }
  ];

    // Track state
  let isOpen = $state(false);
  let selectedItem: DropdownItem = $state(items[0]);

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function selectItem(item: DropdownItem) {
    selectedItem = item;
    isOpen = false;
  }
</script>

<main>

    <div class="dropdown-container">
  <!-- Trigger Button -->
  <button class="dropdown-trigger" onclick={toggleDropdown}>
    {#if selectedItem.img}
      <img src={selectedItem.img} alt={selectedItem.name} class="icon" />
    {/if}
    <span>{selectedItem.name}</span>
    <span class="arrow">{isOpen ? '▲' : '▼'}</span>
  </button>

  <!-- Dropdown Menu -->
  {#if isOpen}
    <ul class="dropdown-menu">
      {#each items as item}
        <li>
          <button class="dropdown-item" onclick={() => selectItem(item)}>
            {#if item.img}
              <img src={item.img} alt={item.name} class="icon" />
            {/if}
            <span>{item.name}</span>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

</main>

<style>
    main {
        max-width: 960px;
        margin: 40px auto;
        display: flex;
        justify-content: center;
    }

    .dropdown-container {
        position: relative;
        width: 220px;
    }

    .dropdown-trigger {
        width: 100%;
        padding: 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        background-color: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .dropdown-trigger:hover {
        background-color: #e9ecef;
        border-color: #adb5bd;
    }

    .dropdown-trigger:active {
        background-color: #dee2e6;
    }

    .dropdown-trigger .icon {
        width: 24px;
        height: 24px;
        object-fit: contain;
        flex-shrink: 0;
    }

    .dropdown-trigger span:not(.arrow) {
        flex: 1;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .arrow {
        font-size: 12px;
        color: #666;
        flex-shrink: 0;
    }

    .dropdown-menu {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        list-style: none;
        margin: 0;
        padding: 8px 0;
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        z-index: 1000;
        animation: slideDown 0.15s ease;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .dropdown-menu li {
        margin: 0;
        padding: 0;
    }

    .dropdown-item {
        width: 100%;
        padding: 10px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        text-align: left;
        transition: background-color 0.15s ease;
    }

    .dropdown-item:hover {
        background-color: #f1f3f5;
    }

    .dropdown-item:active {
        background-color: #e9ecef;
    }

    .dropdown-item .icon {
        width: 20px;
        height: 20px;
        object-fit: contain;
        flex-shrink: 0;
    }
</style>