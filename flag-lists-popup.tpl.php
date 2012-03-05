<?php

/**
 * @file flag-lists-popup.tpl.php
 * Default theme implementation to present all flag lists data.
 *
 * Required structure:
 *   - .flp-wrapper #[nid]-flp-nid
 *    - .flp-trigger
 *    - .flp-popup
 *     - a.selected || a.active x N
 *     - input#[type]-flp-create
 *
 * New list must have 'flp-create' class
 * and textfield input id like:
 *   - $node->type . '-flp-create'
 *
 * WARNING: please checkout flag_lists_popup.js (line 128)
 * if you want to change layout
 *
 * Available variables:
 *   - $node: Node object.
 *   - $lists: All flag lists data.
 *   - $create: If current user can create new lists.
 */
?>
<div class="flp-wrapper" id="<?php print $node->nid; ?>-flp-nid">
  <a href="#" class="flp-trigger"><?php print t('Add to favorites'); // translatable ?></a>
  <div class="flp-popup">
    <div class="flp-fbui-box">
      <ul class="flp-fbui-list">
        <?php foreach ($lists as $list) : ?>
          <li><a rel="nofollow" href="<?php print $list->url; ?>" class="flp-<?php print $list->status ? 'selected' : 'active'; ?>"><?php print $list->title; ?></a></li>
        <?php endforeach; ?>
        <?php if ($create) : ?>
          <li class="flp-create"><input type="text" id="<?php print $node->type; ?>-flp-create"></li>
        <?php endif; ?>
      </ul>
      <i class="flp-fbui-arrow"></i>
    </div>
  </div>
</div>
