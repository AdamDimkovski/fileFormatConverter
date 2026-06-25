<script lang="ts">
    // Import Icons
    import optionIcon from '$lib/assets/OptionIcon.svg';
    import googleDrive from '$lib/assets/googleDriveIcon.png';
    import oneDrive from '$lib/assets/oneDriveIcon.png';
    import dropboxIcon from '$lib/assets/dropboxIcon.svg';
    import urlIcon from '$lib/assets/urlIcon.png';
    import fileUpload from '$lib/assets/fileUpload.svg';

    // Import Sounds
    import clickSound from '$lib/assets/dropdownClick.mp3';

    interface DropdownItem {
        id: string | number;
        name: string;
        img: string | null;
    }

    const items: DropdownItem[] = [
    { id: "DeviceUpload", name: 'Upload From Device', img: fileUpload},
    { id: "GoogleDrive", name: 'Google Drive', img: googleDrive },
    { id: "OneDrive", name: 'One Drive', img: oneDrive },
    { id: "Dropbox", name: 'Drop Box', img: dropboxIcon },
    { id: "URL", name: 'URL', img: urlIcon }
  ];

  const conversionTargets = ['JPG','PNG', 'PDF', 'DOCX']

    // Track state
  let isOpen = $state(false);
  let mode = $state('UploadOptions');
  let selectedItem: DropdownItem = $state({ id: "UploadOptions", name: 'Upload Options:', img: optionIcon});
  let selectedFile: File | null = $state(null);
  let hiddenFileInput: HTMLInputElement | null = $state(null);
  let selectedConversion = $state(conversionTargets[0]);

  function toggleDropdown() {
    playSound();
    isOpen = !isOpen;
  }

  function playSound() {
    const audio = new Audio(clickSound);
    audio.play();
  }

  function selectItem(item: DropdownItem) {
    isOpen = false;
        switch(item.id) {
            case "DeviceUpload":
                // open the hidden file input
                setTimeout(() => hiddenFileInput?.click(), 0);
                break;
            case "GoogleDrive":
            case "OneDrive":
            case "Dropbox":
            case "URL":
            default:
                alert(`${item.id} is not implemented yet.`);
        }
    selectedItem = item;
  }

    // Placeholder functions for file handling
    function handleFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0] ?? null;

        selectedFile = file;
        if (file) {
            selectedItem = { id: "DeviceUpload", name: file.name, img: fileUpload };
            mode = 'DeviceUpload';
        }
    }

    // Placeholder functions for file handling
     function removeSelectedFile() {
        selectedFile = null;
        selectedItem = { id: "UploadOptions", name: 'Upload Options:', img: optionIcon };
        mode = 'UploadOptions';

        if (hiddenFileInput) {
            hiddenFileInput.value = '';
        }
    }

    // Placeholder functions for file handling
    function uploadFile() {
        if (!selectedFile) return;

        // stub: replace with actual upload/conversion logic later
        console.log('Uploading file:', selectedFile.name, selectedFile);
    }

    // Placeholder function for formatting bytes
    function formatBytes(bytes: number) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let value = bytes;
        let index = 0;

        while (value >= 1024 && index < units.length - 1) {
            value /= 1024;
            index += 1;
        }

        return `${value.toFixed(1)} ${units[index]}`;
    }

</script>

<main>
    <div class="upload-panel">
        {#if selectedFile}
            <div class="file-card">
                <div>
                    <strong>{selectedFile.name}</strong>
                    <div class="file-meta">{formatBytes(selectedFile.size)}</div>
                </div>

                <div class="file-actions">
                    <label class="conversion-label">
                        Convert to
                        <select bind:value={selectedConversion}>
                            {#each conversionTargets as target}
                                <option value={target}>{target}</option>
                            {/each}
                        </select>
                    </label>

                <button class="remove-button" on:click={removeSelectedFile}>Remove</button>
                </div>
            </div>
            <button class="upload-button" on:click={uploadFile}>Upload</button>
        {:else}
            <div class="empty-state">
                <p>Select "Upload From Device" and choose a file to start.</p>
            </div>
        {/if}
    </div>

  <input
        type="file"
        bind:this={hiddenFileInput}
        hidden
        on:change={handleFileSelected}
    />

    <div class="dropdown-container">
        <button class="dropdown-trigger" on:click={toggleDropdown}>
            {#if selectedItem.img}
                <img src={selectedItem.img} alt={selectedItem.name} class="icon" />
            {/if}
            <span>{selectedItem.name}</span>
            <span class="arrow">{isOpen ? '^' : 'v'}</span>
        </button>

        {#if isOpen}
            <ul class="dropdown-menu">
                {#each items as item}
                    <li>
                        <button class="dropdown-item" on:click={() => selectItem(item)}>
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
        flex-direction: column;
        align-items: center;
        gap: 22px;
    }

    .upload-panel {
        width: 100%;
        max-width: 720px;
        padding: 22px;
        border: 1px solid #ccc;
        border-radius: 14px;
        background: #fff;
        box-shadow: 0 6px 18px rgba(0,0,0,0.08);
    }

    .file-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 20px;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        background: #f8fafc;
        gap: 16px;
    }

    .file-meta {
        margin-top: 6px;
        color: #6b7280;
        font-size: 13px;
    }

    .remove-button,
    .upload-button {
        margin-top: 16px;
        padding: 12px 18px;
        border: none;
        border-radius: 10px;
        background: #111827;
        color: white;
        cursor: pointer;
    }

    .remove-button {
        padding: 8px 12px;
        background: transparent;
        color: #374151;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
    }

    .remove-button:hover {
        background: #f1f5f9;
    }

    .upload-button {
        width: 100%;
    }

    .empty-state {
        padding: 34px 0;
        text-align: center;
        color: #4b5563;
    }

    .dropdown-container {
        position: relative;
        width: 260px;
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
    }

    .dropdown-trigger .icon,
    .dropdown-item .icon {
        width: 20px;
        height: 20px;
        object-fit: contain;
        flex-shrink: 0;
    }

    .arrow {
        margin-left: auto;
        font-size: 14px;
        color: #667085;
    }

    .dropdown-menu {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 10px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.12);
        z-index: 10;
    }

    .dropdown-item {
        width: 100%;
        padding: 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        background: none;
        border: none;
        cursor: pointer;
        text-align: left;
    }

    .dropdown-item:hover {
        background: #f1f5f9;
    }

    .file-actions {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .conversion-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #334155;
        white-space: nowrap;
    }

    .conversion-label select {
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        background: white;
        color: #111827;
        cursor: pointer;
        font-size: 14px;
    }

</style>